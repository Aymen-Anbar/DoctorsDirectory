export interface Database {
    public: {
      Tables: {
        doctors: {
          Row: {
            id: string;
            name: string;
            specialization: string;
            email: string;
            phone: string;
            address: string;
            bio: string;
          };
          Insert: {
            id?: string;
            name: string;
            specialization?: string;
            email?: string;
            phone?: string;
            address?: string;
            bio?: string;
          };
          Update: {
            id?: string;
            name?: string;
            specialization?: string;
            email?: string;
            phone?: string;
            address?: string;
            bio?: string;
          };
        };
      };
    };
  }