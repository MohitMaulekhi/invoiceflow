import { AppCustomer } from "./customer";
import { InvoiceDetail } from "./invoice";
import { UserProfile } from "./user";

export interface InvoiceBuilderProps {
  customers: AppCustomer[];
  userProfile: UserProfile;
  initialData?: InvoiceDetail | null;
}
