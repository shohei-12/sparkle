require 'rails_helper'

RSpec.describe 'Api::V1::Appearances', type: :request do
  let(:record) { create(:record) }
  let(:appearance) { create(:appearance) }
  let(:image) { Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/test.jpg'), 'image/jpeg') }

  describe 'POST /api/v1/appearances' do
    context 'when data is valid' do
      let(:valid_data) do
        {
          image: image,
          record_id: record.id
        }
      end

      it 'save appearance' do
        expect { save_appearance(valid_data) }.to change(Appearance, :count).by(1)
        expect(response.status).to eq 204
      end
    end

    context 'when data is invalid' do
      let(:invalid_data) do
        {
          image: image,
          record_id: record.id += 1
        }
      end

      it 'not save appearance' do
        expect { save_appearance(invalid_data) }.to change(Appearance, :count).by(0)
        expect(response.status).to eq 204
      end
    end
  end

  describe 'GET /api/v1/appearances' do
    context 'when record exists' do
      context 'when there is corresponding appearances in record' do
        it 'get appearances' do
          get_appearances(appearance.record_id)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body)[0]['id']).to eq appearance.id
        end
      end

      context 'when there is not corresponding appearances in record' do
        it 'not get appearances' do
          get_appearances(record.id)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body)).to eq []
        end
      end
    end

    context 'when record does not exist' do
      it 'raise ActiveRecord::RecordNotFound' do
        expect { get_appearances(record.id + 1) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
