import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const FormInput = ({ form, name, type, label, placeholder }: any) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="shad-form_label">{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              className="shad-input"
              {...field}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default FormInput;
