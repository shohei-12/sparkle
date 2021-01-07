class Api::V1::UsersController < ApplicationController
  before_action :set_user

  def toggle_theme
    @user.update(theme: params[:theme])
  end

  def show
    render json: {
      user: @user,
      followings: @user.followings.length,
      followers: @user.followers.length,
      likes: @user.like_records.length
    }
  end

  def twenty_followings
    twenty_followings = @user.followings.limit(20).offset(params[:start])
    following_infos = User.get_following_infos(twenty_followings, current_api_v1_user)
    render json: following_infos
  end

  def twenty_followers
    twenty_followers = @user.followers.limit(20).offset(params[:start])
    follower_infos = User.get_follower_infos(twenty_followers, current_api_v1_user)
    render json: follower_infos
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
