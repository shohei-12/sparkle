require 'rails_helper'

RSpec.describe 'Api::V1::Meals', type: :request do
  let(:record) { create(:record) }
  let(:eating_time) { create(:eating_time) }
  let(:image) { Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/test.jpg'), 'image/jpeg') }

  describe 'POST /api/v1/meals' do
    context 'when data is valid' do
      let(:valid_data) do
        {
          image: image,
          time: '2020-11-22 15:18:23',
          record_id: record.id,
          eating_time_id: eating_time.id
        }
      end

      it 'save meal' do
        expect { save_meal(valid_data) }.to change(Meal, :count).by(1)
        expect(response.status).to eq 204
      end
    end

    context 'when data is invalid' do
      let(:invalid_data) do
        {
          image: image,
          time: '2020-11-22 15:18:23',
          record_id: record.id += 1,
          eating_time_id: eating_time.id
        }
      end

      it 'not save meal' do
        expect { save_meal(invalid_data) }.to change(Meal, :count).by(0)
        expect(response.status).to eq 204
      end
    end
  end
end
