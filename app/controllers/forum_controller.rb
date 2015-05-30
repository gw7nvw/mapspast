class ForumController < ApplicationController
  def index
   @id=1
   show()
   render 'show'
  end

  def show
    if !@id then @id=params[:id].to_i end
   if !@subject then @subject=params[:thread] end
   if @subject then
      show_thread()
   else
      @index=true
     if (signed_in? and @current_user.role_id==1)
       threads=Message.find_by_sql ['select "subject" from messages where "toUser_id" is null  and subject is not null and forum_id = ? group by "subject" order by max(created_at) desc', @id]
     else
       threads=Message.find_by_sql ['select "subject" from messages where "toUser_id" is null  and subject is not null and forum_id = ? and approved=true group by "subject" order by max(created_at) desc', @id]
     end


     thisItem=0
     @fullthreads=[]
     @counts=[]

     threads.each do |thread|
        @fullthreads[thisItem]=[]
        last_id=Message.find_by_sql ['select max(id) as id from messages where ("subject"=? and "toUser_id" is null and forum_id = ?)', thread.subject, @id]
        last=Message.find_by_id(last_id)
        #get other party

        first_id=Message.find_by_sql ['select min(id) as id from messages where ("subject"=? and "toUser_id" is null and forum_id = ?)', thread.subject, @id]
        first=Message.find_by_id(first_id)
        @fullthreads[thisItem][0]=first
        if (first.id!=last.id) then @fullthreads[thisItem][1]=last end
         if (signed_in? and @current_user.role_id==1)
           msg=Message.find_by_sql ['select count(id) as id from messages where ("subject"=? and "toUser_id" is null and forum_id = ?)', thread.subject, @id]
         else
           msg=Message.find_by_sql ['select count(id) as id from messages where ("subject"=? and "toUser_id" is null and forum_id = ? and approved=true)', thread.subject, @id]
         end
        @counts[thisItem]=msg.first.id
        thisItem+=1
     end

     @threads=@fullthreads.paginate(:per_page => 20, :page => params[:page])
     @edit=true
     @message=Message.new()
     @message.forum_id=@id
   end

  end

def show_thread

   if (signed_in? and @current_user.role_id==1)
        @messages=Message.find_by_sql [%q[select * from messages where ("subject"=? and "toUser_id" is null and forum_id = ?)  order by created_at], @subject, @id]
   else
        @messages=Message.find_by_sql [%q[select * from messages where ("subject"=? and "toUser_id" is null and forum_id = ? and approved=true)  order by created_at], @subject, @id]
   end
   @message=Message.new()
   if @messages and @messages.count>0 then
     @message.subject=@messages.last.subject
     @message.forum_id=@id
     render 'show_thread'
   else
     @subject=nil
     params[:thread]=nil
     show()
     render 'show'
   end
end



def update
   @edit=true
   @message=Message.new(message_params)
   @message.approved=false
   if signed_in? 
     @message.fromUser_id=@current_user.id
     @message.fromName=@current_user.name
     @message.fromEmail=@current_user.email
     @message.approved=true
   end


   errr=false
   if @message.approved==false then
      auth=@message.checkAuth
      case auth
      when "error"
        flash[:error] = "Invald name / email combination"
        errr=true
      when "true"
        @message.approved=true
      when "suspended"
        flash[:error] = "Account suspended"
        errr=true
      else
        @message.save
        if @message.fromEmail  and @message.fromEmail.length>0
          authlist=Authlist.create_or_replace(:address => @message.fromEmail, :name => @message.fromName, :allow => false, :forbid => false)
          if authlist
             authlist.send_auth_email
             flash[:info] = "Check your mail and authenticate your address"
          else
            @message.approved=false
            flash[:success] = "Address validation failed. Comment submitted to moderator for approval." 
          end
        else
          @message.approved=false
          flash[:success] = "Comment submitted to moderator for approval. Providing your email address will avoid this step"
        end
      end
   end
  
   if @message  and errr == false
     if @message.save
       if @message.forum_id then
         @id=@message.forum_id
         @subject=@message.subject
         show()
       else
         index()
       end
     else
         @messages=Message.where(:forum_id=>@message.forum_id)
         @forum=true
         @edit=true
         render 'show'
     end
   else
     @messages=Message.where(:forum_id=>@message.forum_id)
     @forum=true
     @edit=true
     render 'show'
   end 

end

def approve
    if (signed_in? and @current_user.role_id==1)
      message=Message.find_by_id(params[:selected_id])
      if message
         message.approved=true
         message.save
      end
    end

    @subject=params[:subject]
    @id=params[:id]
    show()

end


def destroy
    if (signed_in? and @current_user.role_id==1)
      message=Message.find_by_id(params[:selected_id])
      if message
         message.destroy
      end
    end

    @subject=params[:subject]
    @id=params[:id]
    show()
end

  private
  def message_params
    params.require(:message).permit(:subject, :toUser_id, :fromName, :fromEmail, :forum_id, :message)
  end

end
