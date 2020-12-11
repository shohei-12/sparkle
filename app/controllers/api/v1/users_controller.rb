class Api::V1::UsersController < ApplicationController
  before_action :set_user

  def toggle_theme
    @user.update(theme: params[:theme])
  end

  def show
    render json: @user
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
