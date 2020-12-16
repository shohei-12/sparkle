class Api::V1::LikesController < ApplicationController
  before_action :set_record

  def create
    current_api_v1_user.like(@record)
  end

  def destroy
    current_api_v1_user.unlike(@record)
  end

  private

  def set_record
    @record = Record.find(params[:id])
  end
end
