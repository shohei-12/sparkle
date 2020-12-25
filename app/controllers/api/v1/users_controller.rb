class Api::V1::UsersController < ApplicationController
  before_action :set_user

  def toggle_theme
    @user.update(theme: params[:theme])
  end

  def show
    followings = []
    followers = []
    @user.followings.each do |user|
      bool = current_api_v1_user.following?(user)
      followings.push({
                        id: user.id,
                        name: user.name,
                        profile: user.profile,
                        following: bool
                      })
    end
    @user.followers.each do |user|
      bool = current_api_v1_user.following?(user)
      followers.push({
                       id: user.id,
                       name: user.name,
                       profile: user.profile,
                       following: bool
                     })
    end
    render json: { user: @user, follow_list: followings, follower_list: followers }
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
