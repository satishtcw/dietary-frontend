import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login: React.FC = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setApiError(null);

      try {
        const data = await loginUser(values.username, values.password);
        if (data.success) {
          localStorage.setItem('authenticated', 'true');
          navigate('/dashboard');
        } else {
          setApiError('Invalid login credentials');
        }
      } catch (err) {
        setApiError('Login failed');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    if(isAuthenticated){
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="form-box">
      <h2>Login</h2>
      {apiError && <div style={{ color: 'red' }}>{apiError}</div>}
      <form onSubmit={formik.handleSubmit}>
        <div className="form-input">
          <label className="required">Username</label>
          <input
            type="text"
            name="username"
            onChange={formik.handleChange}
            value={formik.values.username}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username ? (
            <div style={{ color: 'red' }}>{formik.errors.username}</div>
          ) : null}
        </div>

        <div className="form-input">
          <label className="required">Password</label>
          <input
            type="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <div style={{ color: 'red' }}>{formik.errors.password}</div>
          ) : null}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;