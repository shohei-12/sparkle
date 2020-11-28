class Api::V1::UsersController < ApplicationController
  def toggle_theme
    @user = User.find(params[:id])
    @user.update(theme: params[:theme])
  end
end
