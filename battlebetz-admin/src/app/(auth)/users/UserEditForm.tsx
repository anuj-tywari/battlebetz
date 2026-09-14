import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useSupabase } from "@/components/providers/supabase-auth-provider";
import { UserRole } from "@/types/auth";

// Form schema for user editing
const userFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.string(),
  status: z.string(),
  is_admin: z.boolean().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserEditFormProps {
  user: any;
  onSave: () => void;
}

export default function UserEditForm({ user, onSave }: UserEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { supabase, isAuthenticated } = useSupabase();

  // Default form values
  const defaultValues: Partial<UserFormValues> = {
    username: user.username || "",
    email: user.email || "",
    role: user.role || "consumer",
    status: user.status || "active",
    is_admin: user.is_admin || false,
    phone: user.phone || "",
    location: user.location || "",
  };

  // Create form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  // Form submission handler
  const onSubmit = async (data: UserFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You need to be authenticated to update user data.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Update user in database
      const { error } = await supabase
        .from('users')
        .update({
          username: data.username,
          email: data.email,
          role: data.role,
          status: data.status,
          is_admin: data.is_admin,
          phone: data.phone,
          location: data.location,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "User updated",
        description: "The user information has been updated successfully.",
      });
      
      // Call the onSave callback
      onSave();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error updating user",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Authentication Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-800 dark:text-yellow-400">
            You need to be authenticated to edit user data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="promoter">Promoter</SelectItem>
                    <SelectItem value="comp-owner">Competition Owner</SelectItem>
                    <SelectItem value="consumer">Consumer</SelectItem>
                    <SelectItem value="fantasy-manager">Fantasy Manager</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Location (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="is_admin"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-0.5">
                <FormLabel>Admin Access</FormLabel>
                <FormDescription>
                  Grant admin privileges to this user
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSave}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
} 