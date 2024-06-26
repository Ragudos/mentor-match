import { FormPanel, ImagePanel, OauthBlock } from "@/components/auth/common";
import { SignInForm } from "@/components/auth/signin-form";

const SignInPage = () => {
  return (
    <>
      <FormPanel type="signin">
        <SignInForm />
        <OauthBlock type="sign in" />
      </FormPanel>

      <ImagePanel
        imgDirection="right"
        welcomeMessage="Welcome back to"
        motto="Connecting aspiring talent with experienced professionals"
      />
    </>
  );
};

export default SignInPage;
