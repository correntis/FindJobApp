import { UserDocument } from "src/schemas/user.schema";
import { VacancyDocument } from "src/schemas/vacancy.schema";

export class MessagesTemplates {
  static profile(user: UserDocument | undefined) {
    if (!user) {
      return `
      🧑‍💼 **This chat is not linked to an account in the application. You may have disabled notifications!**
      `;
    }

    return `
            🧑‍💼 **Your Profile:**
        
            **First Name:** ${user?.firstName || "Not specified"}
            **Last Name:** ${user?.lastName || "Not specified"}
            **Email:** ${user?.email || "Not specified"}
            **Role:** ${user?.role || "Not specified"}
        
            📅 **Registration Date:** ${user?.createdAt.toLocaleDateString() || "Not specified"}
            `;
  }
}
