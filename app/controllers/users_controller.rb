class UsersController < ApplicationController
  def create
    User.create(
      name: params[:name],
      email: params[:email],
      password: params[:password],
      password_confirmation: params[:password_confirmation]
    )
  end
end
