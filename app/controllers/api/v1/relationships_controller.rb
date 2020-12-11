class Api::V1::RelationshipsController < ApplicationController
  before_action :set_user

  def create
    current_api_v1_user.follow(@user)
  end

  def destroy
    current_api_v1_user.unfollow(@user)
  end

  def following
    render json: current_api_v1_user.following?(@user)
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
