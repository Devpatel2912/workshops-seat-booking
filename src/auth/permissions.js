
import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  workshop: ["create", "read", "update", "delete"],
};

export const ac = createAccessControl(statement);

export const adminRole = ac.newRole({
  ...adminAc.statements,
  workshop: ["create", "read", "update", "delete"],
});

export const userRole = ac.newRole({
  workshop: ["read"],
});


export const organizerRole = ac.newRole({
  workshop: ["create", "read", "update", "delete"],
});
