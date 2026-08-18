import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut, Loader2 } from 'lucide-react';
import { assets } from '../assets/assets';

/**
 * Role-switch confirmation page.
 *
 * URL params:
 *   ?target=student   — educator wants to switch to student panel
 *   ?target=educator  — student wants to switch to educator panel
 *
 * Security model:
 *   - Switching terminates the current session (old JWT is replaced).
 *   - Backend issues a fresh token scoped to the new role.
 *   - Only one role is active per session at any time.
 */
function RoleSwitchConfirm() {
    const [searchParams] = useSearchParams();
    const target = searchParams.get('target'); // 'student' | 'educator'
    const navigate = useNavigate();
    const { user, isAuthenticated, isEducator, logout } = useAuth();
    const [switching, setSwitching] = useState(false);
    const [error, setError] = useState(null);

    // If not authenticated, go to login
    if (!isAuthenticated()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full mx-4 text-center">
                    <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-slate-800 mb-2">Session Required</h2>
                    <p className="text-sm text-slate-500 mb-6">You need to be logged in to switch roles.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const isGoingToStudent = target === 'student';
    const isGoingToEducator = target === 'educator';

    useEffect(() => {
        if (!isAuthenticated()) return;

        if (isGoingToEducator) {
            if (isEducator()) {
                navigate('/educator', { replace: true });
            } else {
                navigate('/educator-access', { replace: true });
            }
            return;
        }

        if (isGoingToStudent) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, isEducator, isGoingToEducator, isGoingToStudent, navigate]);

    // Determine current role label
    const currentRole = isEducator() ? 'Educator' : 'Student';
    const targetRole = isGoingToStudent ? 'Student' : 'Educator';

    const handleSwitch = async () => {
        setSwitching(true);
        setError(null);

        try {
            // Full re-auth: terminate current session and redirect to login
            // The user must re-authenticate with their target role selected
            logout();

            if (isGoingToEducator) {
                // Redirect to main login page with educator pre-selected (via URL param)
                navigate('/login?role=educator', { replace: true });
            } else {
                // Redirect to main login page (defaults to student)
                navigate('/login', { replace: true });
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setSwitching(false);
        }
    };

    const handleGoBack = () => {
        if (isGoingToStudent) {
            navigate('/educator', { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-8 pb-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="w-7 h-7 text-amber-600" />
                    </div>
                    <h1 className="text-lg font-semibold text-slate-900 mb-1">
                        Switch to {targetRole} Panel
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Switching roles requires re-authentication. Your current {currentRole} session will be terminated and you'll need to log in again as {targetRole}.
                    </p>
                </div>

                {/* Session info card */}
                <div className="mx-6 mb-4 bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {user?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                        <div className="ml-auto">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                currentRole === 'Educator'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-blue-100 text-blue-700'
                            }`}>
                                {currentRole}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Security notice */}
                <div className="mx-6 mb-6 flex items-start gap-2.5 text-xs text-slate-400">
                    <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>
                        For security, only one role can be active per session. 
                        You will be logged out and redirected to the login page to re-authenticate.
                    </span>
                </div>

                {/* Error */}
                {error && (
                    <div className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="px-6 pb-6 flex flex-col gap-2.5">
                    <button
                        onClick={handleSwitch}
                        disabled={switching}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {switching ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Switching...
                            </>
                        ) : (
                            <>
                                <LogOut className="w-4 h-4" />
                                Log out &amp; Switch to {targetRole}
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleGoBack}
                        disabled={switching}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to {currentRole} Panel
                    </button>
                </div>
            </div>

            {/* Branding */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
                <img src={assets.logo} alt="VidyaTrack" className="h-5 opacity-30" />
            </div>
        </div>
    );
}

export default RoleSwitchConfirm;
