import { UserDocument } from "src/schemas/user.schema";

export class MessagesTemplates {
  static profile(user: UserDocument | undefined) {
    return `
            🧑‍💼 **Ваш профиль:**
        
            **Имя:** ${user?.firstName || "Не указано"}
            **Фамилия:** ${user?.lastName || "Не указан"}
            **Электронная почта:** ${user?.email || "Не указана"}
            **Роль:** ${user?.role || "Не указана"}
        
            📅 **Дата регистрации:** ${user?.createdAt.toLocaleDateString() || "Не указана"}
            `;
  }
}
