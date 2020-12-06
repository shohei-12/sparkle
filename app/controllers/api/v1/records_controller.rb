class Api::V1::RecordsController < ApplicationController
  before_action :set_user, only: %i[create show]

  def create
    record = @user.records.create(date: Date.parse(params[:date]), appearance: params[:appearance])
    render json: record
  end

  def show
    record = @user.records.find_by(date: params[:date])
    render json: record
  end

  def index
    # Get 20 cases of data
    records = Record.limit(20).offset(params[:start])
    render json: records
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
