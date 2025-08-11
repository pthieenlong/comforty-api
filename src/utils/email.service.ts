import nodemailer from 'nodemailer';
import { configModule } from '@/common/config/config.module';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: configModule.getEmailUser(),
      pass: configModule.getEmailPassword(),
    },
  });

  public static async sendVerificationEmail(
    email: string,
    username: string,
    verificationToken: string,
  ): Promise<boolean> {
    try {
      // Sử dụng JWT token thay vì UUID
      const verificationUrl = `${configModule.getFrontendUrl()}/auth/verify-email?token=${verificationToken}`;

      const mailOptions = {
        from: configModule.getEmailUser(),
        to: email,
        subject: 'Xác thực tài khoản - Comforty',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Xin chào ${username}!</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại Comforty.</p>
            <p>Vui lòng click vào link bên dưới để xác thực tài khoản của bạn:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Xác thực tài khoản
              </a>
            </div>
            <p>Hoặc copy link này vào trình duyệt:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p>Link này sẽ hết hạn sau 24 giờ.</p>
            <p>Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              Email này được gửi tự động, vui lòng không trả lời.
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  public static async sendPasswordResetEmail(
    email: string,
    username: string,
    resetToken: string,
  ): Promise<boolean> {
    try {
      const resetUrl = `${configModule.getFrontendUrl()}/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: configModule.getEmailUser(),
        to: email,
        subject: 'Đặt lại mật khẩu - Comforty',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Xin chào ${username}!</h2>
            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Comforty.</p>
            <p>Click vào link bên dưới để đặt lại mật khẩu:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #dc3545; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Đặt lại mật khẩu
              </a>
            </div>
            <p>Hoặc copy link này vào trình duyệt:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p>Link này sẽ hết hạn sau 1 giờ.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              Email này được gửi tự động, vui lòng không trả lời.
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}
