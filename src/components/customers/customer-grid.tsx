"use client";

import { useMemo, useState, useTransition } from "react";
import type { SubmitEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateCustomerAction } from "@/server/actions/customers/update-customer";
import { deleteCustomerAction } from "@/server/actions/customers/delete-customer";
import { createCustomerAction } from "@/server/actions/customers/create-customer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, MoreVertical, Edit2, Trash2, Building2, Mail, Phone, Loader2 } from "lucide-react";
import type { AppCustomer, CustomerSortOption } from "@/types/customer";

type CustomerGridProps = {
  initialCustomers: AppCustomer[];
};

export function CustomerGrid({ initialCustomers }: CustomerGridProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<CustomerSortOption>("newest");
  const [editingCustomer, setEditingCustomer] = useState<AppCustomer | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [, startDeleteTransition] = useTransition();
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [isCreatePending, startCreateTransition] = useTransition();

  const filteredAndSorted = useMemo(() => {
    const normalizedSearch = search.toLowerCase();
    const result = initialCustomers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(normalizedSearch) ||
        customer.companyName?.toLowerCase().includes(normalizedSearch) ||
        customer.email?.toLowerCase().includes(normalizedSearch)
      );
    });

    result.sort((a, b) => {
      if (sort === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      if (sort === "az") {
        return a.name.localeCompare(b.name);
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [initialCustomers, search, sort]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      startDeleteTransition(async () => {
        await deleteCustomerAction(id);
      });
    }
  };

  const handleSortChange = (value: CustomerSortOption | null) => {
    setSort(value ?? "newest");
  };

  const handleEditClose = (open: boolean) => {
    if (!open) {
      setEditingCustomer(null);
      setUpdateError(null);
    }
  };

  const handleCreateClose = (open: boolean) => {
    setIsCreating(open);
    if (!open) {
      setCreateError(null);
    }
  };

  const handleUpdateSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUpdateError(null);

    const formData = new FormData(event.currentTarget);

    startUpdateTransition(async () => {
      const result = await updateCustomerAction(formData);

      if (result?.error) {
        setUpdateError(result.error);
        return;
      }

      setEditingCustomer(null);
    });
  };

  const handleCreateSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    startCreateTransition(async () => {
      const result = await createCustomerAction(formData);

      if (result?.error) {
        setCreateError(result.error);
        return;
      }

      form.reset();
      setIsCreating(false);
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="pl-10 bg-slate-50 border-transparent focus:border-primary focus:bg-white rounded-xl h-12 text-base"
          />
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-45 h-12 rounded-xl bg-slate-50 border-transparent focus:border-primary focus:bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="az">Alphabetical (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => setIsCreating(true)}
            className="rounded-xl font-bold shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform px-6 h-12 hidden sm:flex"
          >
            Add Customer
          </Button>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="rounded-xl font-bold shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform px-6 h-12 w-full sm:hidden"
        >
          Add Customer
        </Button>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredAndSorted.map((customer) => (
            <motion.div
              key={customer.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col relative group"
            >
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem onClick={() => setEditingCustomer(customer)} className="cursor-pointer">
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(customer.id)}
                      className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">{customer.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{customer.companyName || "Individual"}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {customer.email && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {(customer.city || customer.country) && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {[customer.city, customer.state, customer.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-medium text-slate-400">
                <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
                {customer.taxId && <span className="bg-slate-100 px-2 py-1 rounded-md">TAX: {customer.taxId}</span>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredAndSorted.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500 font-medium">No customers found.</p>
        </div>
      )}

      <Dialog open={!!editingCustomer} onOpenChange={handleEditClose}>
        <DialogContent className="sm:max-w-150 rounded-[24px] p-0 overflow-hidden bg-white border-none shadow-2xl">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <DialogTitle className="text-xl font-bold text-slate-900">Edit Customer</DialogTitle>
            <DialogDescription>Update customer details and billing information.</DialogDescription>
          </div>

          {editingCustomer && (
            <form onSubmit={handleUpdateSubmit}>
              <input type="hidden" name="id" value={editingCustomer.id} />
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Basic Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Primary Contact Name *</label>
                      <Input name="name" defaultValue={editingCustomer.name} required className="bg-slate-50 border-slate-200 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Company Name</label>
                      <Input name="companyName" defaultValue={editingCustomer.companyName || ""} className="bg-slate-50 border-slate-200 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Email Address</label>
                      <Input name="email" type="email" defaultValue={editingCustomer.email || ""} className="bg-slate-50 border-slate-200 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                      <Input name="phone" type="tel" defaultValue={editingCustomer.phone || ""} className="bg-slate-50 border-slate-200 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Tax ID / VAT</label>
                      <Input name="taxId" defaultValue={editingCustomer.taxId || ""} className="bg-slate-50 border-slate-200 focus:border-primary" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Billing Address</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Street Address</label>
                    <Input name="addressLine1" defaultValue={editingCustomer.addressLine1 || ""} className="bg-slate-50 border-slate-200 focus:border-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">City</label>
                      <Input name="city" defaultValue={editingCustomer.city || ""} className="bg-slate-50 border-slate-200 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">State / Region</label>
                      <Input name="state" defaultValue={editingCustomer.state || ""} className="bg-slate-50 border-slate-200 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">ZIP / Postal Code</label>
                      <Input name="zip" defaultValue={editingCustomer.zip || ""} className="bg-slate-50 border-slate-200 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Country</label>
                      <Input name="country" defaultValue={editingCustomer.country || ""} className="bg-slate-50 border-slate-200 focus:border-primary" />
                    </div>
                  </div>
                </div>

                {updateError && (
                  <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-xl border border-red-100">{updateError}</p>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setEditingCustomer(null)} disabled={isUpdatePending} className="rounded-xl font-semibold">
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdatePending} className="rounded-xl font-bold bg-primary text-white shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform">
                  {isUpdatePending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {isUpdatePending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCreating} onOpenChange={handleCreateClose}>
        <DialogContent className="sm:max-w-150 rounded-[24px] p-0 overflow-hidden bg-white border-none shadow-2xl">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <DialogTitle className="text-xl font-bold text-slate-900">Add Customer</DialogTitle>
            <DialogDescription>Add a new customer to your database.</DialogDescription>
          </div>

          <form onSubmit={handleCreateSubmit}>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Basic Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Primary Contact Name *</label>
                    <Input name="name" required className="bg-slate-50 border-slate-200 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Company Name</label>
                    <Input name="companyName" className="bg-slate-50 border-slate-200 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <Input name="email" type="email" className="bg-slate-50 border-slate-200 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                    <Input name="phone" type="tel" className="bg-slate-50 border-slate-200 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Tax ID / VAT</label>
                    <Input name="taxId" className="bg-slate-50 border-slate-200 focus:border-primary" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Billing Address</h3>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Street Address</label>
                  <Input name="addressLine1" className="bg-slate-50 border-slate-200 focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">City</label>
                    <Input name="city" className="bg-slate-50 border-slate-200 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">State / Region</label>
                    <Input name="state" className="bg-slate-50 border-slate-200 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">ZIP / Postal Code</label>
                    <Input name="zip" className="bg-slate-50 border-slate-200 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Country</label>
                    <Input name="country" className="bg-slate-50 border-slate-200 focus:border-primary" />
                  </div>
                </div>
              </div>

              {createError && (
                <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-xl border border-red-100">{createError}</p>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)} disabled={isCreatePending} className="rounded-xl font-semibold">
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatePending} className="rounded-xl font-bold bg-primary text-white shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform">
                {isCreatePending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isCreatePending ? "Saving..." : "Add Customer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
