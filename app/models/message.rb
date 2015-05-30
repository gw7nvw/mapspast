class Message < ActiveRecord::Base

  validates :fromName, :presence => true
  validates :subject, :presence => true
  validates :message, :presence => true

#  before_save :downcase_fromEmail
  #VALID_EMAIL_REGEX = /$/|/\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :fromEmail, format: { with: /\A(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})\z/i }
  #validates :fromEmail, format: { with: VALID_EMAIL_REGEX }



def checkAuth
  authorised="false"
  if self.valid?
    #check if this email is used by another name.  Error if so
    notouremail=Authlist.find_by_sql [ "select * from authlists where address = ? and name <> ?", self.fromEmail, self.fromName ]
    if notouremail.count>0 then
      authorised="error"
    else
      authnames=Authlist.find_by_sql [ "select * from authlists where name = ?", self.fromName ]
        if authnames.count>0 
        auth=auths.first
        if !self.fromEmail or (self.fromEmail and auth.address != self.fromEmail)
           authorised="error"
        end
    
        if self.fromEmail and self.fromEmail.length>1 and auth.address == self.fromEmail
           if auth.allow==true then
             authorised="true"
           end
           if auth.forbid==true then
               authorised="suspended"
           end
        end
      end
    end
  else 
    authorised="error"
  end
  authorised
end


  def downcase_fromEmail
      if(fromEmail.length<1) then fromEmail="anon@anon.net" end
      self.fromEmail = fromEmail.downcase
  end

end
