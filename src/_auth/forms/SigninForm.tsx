import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { signinSchema } from "../../lib/validation/";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useSignAccountMutation } from "@/lib/react-query/QueriesNMutations";
import { useUserAuthContext } from "@/context/AuthContext";
import FormInput from "@/components/shared/FormInput";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: signinAccount, isPending } = useSignAccountMutation();
  const { checkAuthUser } = useUserAuthContext();
  async function onSubmit(values: z.infer<typeof signinSchema>) {
    const session = await signinAccount({
      email: values.email,
      password: values.password,
    });
    if (!session) {
      return toast({
        title: "Invalid credentials. Please check the email and password.",
      });
    }
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        title: "Sign in failed. please try again",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="w-full px-8 sm:px-0 sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Login to your account now!
        </h2>
        <p className="text-ligt-3 small-medium md:base-regular mt-2">
          Welcome Back!
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 mt-8 w-full"
        >
          <FormInput form={form} name="email" type="email" label="Email" />
          <FormInput
            form={form}
            name="password"
            type="password"
            label="Password"
          />
          <Button type="submit" className="shad-button_primary">
            {isPending ? (
              <div className="flex-center gap-4">
                <Loader /> Loading...
              </div>
            ) : (
              "Log in"
            )}
          </Button>
          <p className="text-sm-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
