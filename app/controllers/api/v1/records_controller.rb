class Api::V1::RecordsController < ApplicationController
  before_action :set_user, only: %i[create show]

  def create
    record = @user.records.create(date: params[:date])
    render json: record
  end

  def show
    record = @user.records.find_by(date: params[:date])
    render json: record
  end

  def index
    # Get 20 cases of data
    records = Record.limit(20).offset(params[:start])
    array = []
    records.each do |record|
      array.push({
                   date: record.date,
                   appearance: record.appearances.first,
                   profile: record.user.profile,
                   author: record.user.name,
                   author_id: record.user_id
                 })
    end
    render json: array
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
