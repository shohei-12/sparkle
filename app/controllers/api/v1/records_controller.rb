class Api::V1::RecordsController < ApplicationController
  before_action :set_user, only: %i[show twenty_like_records]

  def create
    record = current_api_v1_user.records.create(date: params[:date])
    render json: record
  end

  def show
    record = @user.records.find_by(date: params[:date])
    render json: record
  end

  def index
    # Get 20 cases of data
    twenty_records = Record.limit(20).offset(params[:start])
    record_infos = Record.get_record_infos(twenty_records, current_api_v1_user)
    render json: record_infos
  end

  def twenty_like_records
    twenty_like_records = @user.like_records.limit(20).offset(params[:start])
    record_infos = Record.get_record_infos(twenty_like_records, current_api_v1_user)
    render json: record_infos
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
