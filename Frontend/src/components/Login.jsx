import { useState } from 'react';
import '../styles/Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    function validate() {
        const next = {};
        if (!email.trim()) {
            next.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            next.email = 'Enter a valid email';
        }
        if (!password) {
            next.password = 'Password is required';
        }
        return next;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage('');
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length > 0) return;

        setSubmitting(true);
        try {
            const res = await fetch('https://localhost:7054/Auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    loginEmail: email,
                    password: password,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const apiMsg = data?.message || data?.error || 'Login failed. Please try again.';
                setMessage(apiMsg);
                return;
            }
            setMessage(`Logged in as ${email}${remember ? ' (remembered)' : ''}`);

            // TODO: navigate to your app's main page (e.g., using react-router)
            // navigate('/chat');
        } catch (err) {
            setMessage('Unable to reach server. Check your connection.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <div className="login-container">
                <h1 className="title-h1"> Welcome to ChatX</h1>
                <form onSubmit={handleSubmit} className="login-card">
                    <h2 className="login-title">Sign in</h2>

                    <div className="field">
                        <label htmlFor="email" className="label">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            style={{ borderColor: errors.email ? '#e11d48' : '#e5e7eb' }}
                            disabled={submitting}
                            autoComplete="email"
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>

                    <div className="field">
                        <label htmlFor="password" className="label">Password</label>
                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                style={{ borderColor: errors.password ? '#e11d48' : '#e5e7eb' }}
                                disabled={submitting}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="toggle-btn"
                                tabIndex={-1}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>

                    <div className="row">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                disabled={submitting}
                                style={{ marginRight: 8 }}
                            />
                            Remember me
                        </label>
                        <a href="#" className="link" onClick={(e) => e.preventDefault()}>Forgot password?</a>
                    </div>

                    <button type="submit" disabled={submitting} className="submit-btn" style={{ opacity: submitting ? 0.7 : 1 }}>
                        {submitting ? 'Signing in…' : 'Sign in'}
                    </button>

                    {message && <div className="note">{message}</div>}
                </form>
            </div>
        </>
    );
}