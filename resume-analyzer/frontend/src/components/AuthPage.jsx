import { Auth } from '@/components/ui/auth-form-1';

const AuthPage = ({ onBack, onGoogleSignIn, onEmailLogin, onEmailSignup, onForgotPassword }) => {
  return (
    <div className="min-h-screen bg-transparent px-4 py-10 text-white selection:bg-primary/30 flex items-center justify-center">
      <Auth
        onBack={onBack}
        onGoogleSignIn={onGoogleSignIn}
        onSignIn={onEmailLogin}
        onSignUp={onEmailSignup}
        onForgotPassword={onForgotPassword}
      />
    </div>
  );
};

export default AuthPage;
