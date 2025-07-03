import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Organisation = {
  id: number;
  created_at: string;
  orgName: string;
  orgHandle: string;
  adminEmail: string;
  members: Record<number, string>;
};

const Organisations = () => {
  const user = useUser();
  const [createOrgDialogOpen, setCreateOrgDialogOpen] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgHandle, setOrgHandle] = useState("");
  const [orgMemberEmails, setOrgMembersEmail] = useState<string[]>([]);
  const [orgMemberEmail, setOrgMemberEmail] = useState("");

  const [isHandleChecking, setIsHandleChecking] = useState(false);
  const [isHandleAvailable, setIsHandleAvailable] = useState<boolean | null>(
    null
  );

  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(
    null
  );

  const [isCreating, setIsCreating] = useState(false);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [memberOf, setMemberOf] = useState<Organisation[]>([]);

  const handleDialogChange = (open: boolean) => {
    setCreateOrgDialogOpen(open);

    if (!open) {
      setOrgName("");
      setOrgHandle("");
      setOrgMemberEmail("");
      setOrgMembersEmail([]);
      setIsHandleAvailable(null);
      setIsEmailAvailable(null);
    }
  };

  // Check for handle availability
  const checkHandleAvailability = async (handle: string) => {
    if (!handle) return;

    setIsHandleChecking(true);
    try {
      const response = await axiosInstance.get(
        `/org/check-handle?handle=${handle}`
      );
      setIsHandleAvailable(response?.data?.message);
    } catch (error) {
      setIsHandleAvailable(null);
    } finally {
      setIsHandleChecking(false);
    }
  };

  // Check for email availability
  const checkEmailAvailability = async (email: string) => {
    if (!email) return;

    setIsEmailChecking(true);
    try {
      const response = await axiosInstance.get(
        `/org/check-email?email=${email}`
      );
      setIsEmailAvailable(response?.data?.message);
    } catch (error) {
      setIsEmailAvailable(null);
    } finally {
      setIsEmailChecking(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      checkHandleAvailability(orgHandle.trim().toLowerCase());
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [orgHandle]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      checkEmailAvailability(orgMemberEmail.trim().toLowerCase());
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [orgMemberEmail]);

  const handleAddMember = () => {
    const trimmedEmail = orgMemberEmail.trim().toLowerCase();
    if (
      trimmedEmail &&
      isEmailAvailable &&
      !orgMemberEmails.includes(trimmedEmail) &&
      trimmedEmail != user!.email
    ) {
      setOrgMembersEmail([...orgMemberEmails, trimmedEmail]);
      setOrgMemberEmail("");
      setIsEmailAvailable(null);
    }
  };

  // Creating an organisation
  const handleCreate = async () => {
    const membersObject = orgMemberEmails.reduce((acc, email, index) => {
      acc[index] = email;
      return acc;
    }, {} as Record<number, string>);

    const data = {
      token: localStorage.getItem("token"),
      orgName: orgName,
      orgHandle: orgHandle,
      members: membersObject,
    };
    setIsCreating(true);
    try {
      const response = await axiosInstance.post("/org/create", data);
      toast.success(response.data.message);
      fetchOrganisations();
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsCreating(false);
      handleDialogChange(false);
    }
  };

  // Fetch all organisations
  const fetchOrganisations = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.get("/org/fetch", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await axiosInstance.get("/org/fetch-memberof", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMemberOf(res.data.message);

      setOrganisations(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrganisations();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Organisations</h1>
        <Button onClick={() => setCreateOrgDialogOpen(true)}>
          <IconPlus stroke={2} /> Create
        </Button>
      </div>

      <Dialog open={createOrgDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organisation</DialogTitle>
            <DialogDescription>
              Organisations help you collaborate with your team for better
              outcomes.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Google Analytics Team"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="username">Handle</Label>
              <Input
                id="username"
                name="username"
                placeholder="@google_analytics"
                value={orgHandle}
                onChange={(e) => setOrgHandle(e.target.value)}
              />
              <div className="text-sm">
                {isHandleChecking && <span>Checking handle...</span>}
                {!isHandleChecking &&
                  isHandleAvailable === false &&
                  orgHandle && (
                    <span className="text-green-600">Handle is available</span>
                  )}
                {!isHandleChecking &&
                  isHandleAvailable === true &&
                  orgHandle && (
                    <span className="text-red-600">
                      Handle is already taken
                    </span>
                  )}
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="member">Add members</Label>
              <div className="flex gap-2">
                <Input
                  id="member"
                  name="member"
                  value={orgMemberEmail}
                  placeholder="adam@gmail.com"
                  onChange={(e) => setOrgMemberEmail(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleAddMember}
                  disabled={
                    !orgMemberEmail ||
                    !isEmailAvailable ||
                    orgMemberEmails.includes(
                      orgMemberEmail.trim().toLowerCase()
                    )
                  }
                >
                  <IconPlus stroke={2} />
                </Button>
              </div>

              {!isEmailChecking &&
                isEmailAvailable === false &&
                orgMemberEmail && (
                  <div className="text-red-600 text-sm">
                    No such email exists.
                  </div>
                )}
              {orgMemberEmails.includes(
                orgMemberEmail.trim().toLowerCase()
              ) && (
                <div className="text-red-600 text-sm">Email already added.</div>
              )}
            </div>

            <div>
              <ul className="list-disc ml-5">
                {orgMemberEmails.map((email, index) => (
                  <li key={index}>{email}</li>
                ))}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOrgDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleCreate();
              }}
              disabled={!orgHandle || !orgName || isHandleAvailable === true}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-12 text-2xl">Your organisations</div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organisations.map((org) => (
          <div
            key={org.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{org.orgName}</h2>
            <p className="text-gray-600">@{org.orgHandle}</p>
            <p className="text-sm mt-2 text-gray-500">
              Created at: {new Date(org.created_at).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Admin: {org.adminEmail}</p>

            {org.members && (
              <div className="mt-3 flex flex-col gap-2">
                <p className="font-medium text-sm">Members</p>
                <div className="flex items-center">
                  {Object.values(org.members).map((email, _) => (
                    <Tooltip key={email}>
                      <TooltipTrigger asChild>
                        <img
                          src={`https://avatar.vercel.sh/${email}`}
                          className={`h-8 w-8 rounded-full border border-white shadow -ml-2 first:ml-0`}
                          alt="Avatar"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{email}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="">
        {memberOf.length > 0 && (
          <>
            <div className="mt-12 text-2xl">Shared with you</div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memberOf.map((org) => (
                <div
                  key={org.id}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <h2 className="text-xl font-semibold">{org.orgName}</h2>
                  <p className="text-gray-600">@{org.orgHandle}</p>
                  <p className="text-sm mt-2 text-gray-500">
                    Created at: {new Date(org.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Admin: {org.adminEmail}
                  </p>

                  {org.members && (
                    <div className="mt-3 flex flex-col gap-2">
                      <p className="font-medium text-sm">Members</p>
                      <div className="flex items-center">
                        {Object.values(org.members).map((email, _) => (
                          <Tooltip key={email}>
                            <TooltipTrigger asChild>
                              <img
                                src={`https://avatar.vercel.sh/${email}`}
                                className={`h-8 w-8 rounded-full border border-white shadow -ml-2 first:ml-0`}
                                alt="Avatar"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{email}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Organisations;
