class UsersController < ApplicationController
  before_action :signed_in_user, only: [:edit, :update] 
  def index
    @users=User.where(:activated=>true)
  end

  def show
    if(!(@user = User.find_by_id(params[:id]))) 
      redirect_to '/'
    end
  end


  def new
    @user = User.new
  end

 def create
    @user = User.new(user_params)

      @user.role_id=Role.find_by(:name => 'user').id

      @user.activated=true
      @user.activated_at=Time.now()
      if @user.save

#        @user.send_activation_email
#        flash[:info] = "Please check your email for details on how to activate your account"
#        redirect_to '/login'
        sign_in @user
        flash[:success] = "Welcome to Maps Past"
        redirect_to '/users/'+@user.id.to_s
      else
        render 'new'
      end
  end

  def edit
    @user = User.where(name: params[:id]).first
    if((@user.id!=@current_user.id) and (@current_user.role!=Role.find_by( :name => 'root')))
        redirect_to '/users/'+@user.name
    end
  end

  def update
    @user = User.find_by_id(params[:id])
    if @user.update_attributes(user_params)
      flash[:success] = "User details updated"

      # Handle a successful update.
      redirect_to '/users/'+@user.name
    else
      render 'edit'
    end
  end


  private

    def user_params
      params.require(:user).permit(:name, :firstName, :lastName, :email, :password,
                                   :password_confirmation)
    end


    # Before filters

end
