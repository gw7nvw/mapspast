class UserMailer < ActionMailer::Base
  default from: "noreply@wharncliffe.co.nz"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.account_activation.subject
  #
  def address_auth(authlist)
    @authlist = authlist
    mail to: authlist.address, subject: "Address authentication"
  end

  def account_activation(user)
    @user = user
    mail to: user.email, subject: "Account activation"
  end
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.password_reset.subject
  #
  def password_reset(user)
    @user = user
    mail to: user.email, subject: "Password reset"
  end
end
