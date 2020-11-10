class UsersController < ApplicationController
  def create
    @user = User.create(name: params[:name], email: params[:email])
    render json: @user
  end
end
