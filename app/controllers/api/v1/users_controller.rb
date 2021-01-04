class Api::V1::UsersController < ApplicationController
  before_action :set_user

  def toggle_theme
    @user.update(theme: params[:theme])
  end

  def show
    following_infos = User.get_following_infos(@user.followings, current_api_v1_user)
    follower_infos = User.get_follower_infos(@user.followers, current_api_v1_user)
    render json: {
      user: @user,
      follow_list: following_infos,
      follower_list: follower_infos,
      likes: @user.like_records.length
    }
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
