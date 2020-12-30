class Api::V1::UsersController < ApplicationController
  before_action :set_user

  def toggle_theme
    @user.update(theme: params[:theme])
  end

  def show
    followings = User.get_followings(@user.followings, current_api_v1_user)
    followers = User.get_followers(@user.followers, current_api_v1_user)
    render json: {
      user: @user,
      follow_list: followings,
      follower_list: followers,
      likes: @user.like_records.length
    }
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
