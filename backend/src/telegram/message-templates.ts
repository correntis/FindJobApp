import { UserDocument } from "src/schemas/user.schema";
import { VacancyDocument } from "src/schemas/vacancy.schema";

export class MessagesTemplates {
  static profile(user: UserDocument | undefined) {
    if (!user) {
      return `
      🧑‍💼 **Этот чат не связан ни с одним акканутом. Навреное вы отключили уведомления!**
      `;
    }

    return `
            🧑‍💼 **Ваш профиль:**
        
            **Имя:** ${user?.firstName || "Не указано"}
            **Фамилия:** ${user?.lastName || "Не указано"}
            **Email:** ${user?.email || "Не указано"}
            **Роль:** ${user?.role || "Не указано"}
        
            📅 **Дата регистрации:** ${user?.createdAt.toLocaleDateString() || "Не указано"}
            `;
  }
}
