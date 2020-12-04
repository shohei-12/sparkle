require 'rails_helper'

RSpec.describe 'Api::V1::Records', type: :request do
  let(:user) { create(:user) }
  let(:record) { create(:record) }
  let(:image) { Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/test.jpg'), 'image/jpeg') }

  describe 'POST /api/v1/records' do
    context 'when data is valid' do
      let(:valid_data) do
        {
          id: user.id,
          date: '2020-11-22',
          appearance: image
        }
      end

      it 'save record' do
        expect { save_record(valid_data) }.to change(Record, :count).by(1)
        expect(response.status).to eq 200
      end
    end

    context 'when data is invalid' do
      let(:invalid_data) do
        {
          id: user.id += 1,
          date: '2020-11-22',
          appearance: image
        }
      end

      it 'not save record' do
        save_record(invalid_data)
      rescue StandardError
      end
    end
  end

  describe 'GET /api/v1/record' do
    context 'when record exists' do
      let(:data) do
        {
          id: record.user.id,
          date: '2020-11-22'
        }
      end

      it 'get record' do
        get_record(data)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)['id']).to eq record.id
      end
    end

    context 'when record does not exist' do
      let(:data) do
        {
          id: record.user.id,
          date: '2020-11-23'
        }
      end

      it 'not get record' do
        get_record(data)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)).to eq nil
      end
    end
  end
end
