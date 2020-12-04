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
    records = Record.all
    render json: records
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
