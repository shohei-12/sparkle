require 'rails_helper'

RSpec.describe 'Api::V1::Appearances', type: :request do
  let(:record) { create(:record) }
  let(:user) { create(:user) }
  let(:token) { sign_in({ email: user.email, password: 'password' }) }
  let(:appearance) { create(:appearance) }
  let(:image) { Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/test.jpg'), 'image/jpeg') }
  let(:data) do
    {
      image: image,
      id: record.id
    }
  end

  describe 'POST /api/v1/appearances' do
    context 'when token is valid' do
      context 'when it is record for current user' do
        before do
          record = create(:record)
          @token = sign_in({ email: record.user.email, password: 'password' })
          @data = { image: image, id: record.id }
        end

        it 'add appearance' do
          expect { add_appearance(@data, @token) }.to change(Appearance, :count).by(1)
          expect(response.status).to eq 204
        end
      end

      context 'when it is not record for current user' do
        it 'not add appearance' do
          expect { add_appearance(data, token) }.to change(Appearance, :count).by(0)
          expect(response.status).to eq 204
        end
      end
    end

    context 'when token is invalid' do
      it 'raise NoMethodError' do
        expect { add_appearance(data, nil) }.to raise_error(NoMethodError)
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
