// stores/contactStore.ts
import { create } from 'zustand';
import { apiConfig } from '@/config';
import { toast } from 'sonner';

type ContactFormState = {
  fullname: string;
  email: string;
  message: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string;

  setFullname: (name: string) => void;
  setEmail: (email: string) => void;
  setMessage: (msg: string) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
};

export const useContactStore = create<ContactFormState>((set, get) => ({
  fullname: '',
  email: '',
  message: '',
  status: 'idle',
  errorMessage: '',

  setFullname: (fullname) => set({ fullname }),
  setEmail: (email) => set({ email }),
  setMessage: (message) => set({ message }),

  submitForm: async () => {
    const { fullname, email, message } = get();

    if (!fullname || !email || !message) {
      toast.error('All fields are required.');
      set({ status: 'error' });
      return;
    }

    set({ status: 'loading' });

    try {
      const response = await fetch(`${apiConfig.API_URL}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullname,
          email,
          message,
        }),
      });

      if (response.ok) {
        toast.success('Message sent successfully! we will reach out to you within 24 hours on Email.');
        set({
          status: 'success',
          fullname: '',
          email: '',
          message: '',
        });
        setTimeout(() => set({ status: 'idle' }), 1000); // Reset loading state quickly
      } else {
        const data = await response.json().catch(() => ({}));
        const msg = data.message || 'Failed to send message. Please try again.';
        toast.error(msg, {
          style: {
            background: "red",
            color: 'white',
          }
        });
        set({ status: 'error' });
      }
    } catch {
      toast.error('Network error. Please check your connection and try again.', {
        style: {
          background: "red",
          color: 'white',
        }
      });
      set({ status: 'error' });
    }
  },

  resetForm: () => {
    set({
      fullname: '',
      email: '',
      message: '',
      status: 'idle',
      errorMessage: '',
    });
  },
}));