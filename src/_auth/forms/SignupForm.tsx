import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { signupSchema } from "../../lib/validation/";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import {
  useCreateUserAccountMutation,
  useSignAccountMutation,
} from "@/lib/react-query/QueriesNMutations";
import { useUserAuthContext } from "@/context/AuthContext";
import FormInput from "@/components/shared/FormInput";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const { mutateAsync: createNewUser, isPending } =
    useCreateUserAccountMutation();
  const { mutateAsync: signinAccount } = useSignAccountMutation();
  const { checkAuthUser } = useUserAuthContext();
  async function onSubmit(values: z.infer<typeof signupSchema>) {
    const newUser = await createNewUser(values);
    if (!newUser) {
      return toast({
        title: "Sign up failed. please try again",
      });
    }
    const session = await signinAccount({
      email: values.email,
      password: values.password,
    });
    if (!session) {
      return toast({
        title: "Sign in failed. please try again",
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
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create New Account</h2>
        <p className="text-ligt-3 small-medium md:base-regular mt-2">
          Please enter your details to use snapgram
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 mt-8 w-full"
        >
          <FormInput form={form} name="name" type="text" label="Name" />
          <FormInput form={form} name="username" type="text" label="Username" />
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
              "Sign up"
            )}
          </Button>
          <p className="text-sm-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
