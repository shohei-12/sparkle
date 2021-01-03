require 'rails_helper'

RSpec.describe 'Api::V1::Records', type: :request do
  let(:user) { create(:user) }
  let(:record) { create(:record) }
  let(:start0) do
    { start: 0 }
  end
  let(:start20) do
    { start: 20 }
  end

  describe 'POST /api/v1/records' do
    context 'when data is valid' do
      let(:valid_data) do
        {
          id: user.id,
          date: '2020-11-22'
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
          date: '2020-11-22'
        }
      end

      it 'raise ActiveRecord::RecordNotFound' do
        expect { save_record(invalid_data) }.to raise_error(ActiveRecord::RecordNotFound)
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

  describe 'GET /api/v1/records' do
    context 'when there are more than 20 records' do
      before { create_list(:record, 21) }

      it 'get 20 records' do
        get_20_records(start0)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body).length).to eq 20
      end

      it 'get 1 record' do
        get_20_records(start20)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body).length).to eq 1
      end
    end

    context 'when there are less than 20 records' do
      before { create_list(:record, 2) }

      it 'get 2 records' do
        get_20_records(start0)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body).length).to eq 2
      end

      it 'not get record' do
        get_20_records(start20)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body).length).to eq 0
      end
    end
  end

  describe 'GET /api/v1/users/:id/like-records' do
    context 'when user exists' do
      before { @user = create(:user) }

      context 'when there are more than 20 like records' do
        before do
          21.times do
            record_n = create(:record)
            @user.like(record_n)
          end
        end

        it 'get 20 like records' do
          get_20_like_records(start0, @user.id)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body).length).to eq 20
        end

        it 'get 1 like record' do
          get_20_like_records(start20, @user.id)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body).length).to eq 1
        end
      end

      context 'when there are less than 20 like records' do
        before do
          2.times do
            record_n = create(:record)
            @user.like(record_n)
          end
        end

        it 'get 2 like records' do
          get_20_like_records(start0, @user.id)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body).length).to eq 2
        end

        it 'not get like records' do
          get_20_like_records(start20, @user.id)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body).length).to eq 0
        end
      end
    end

    context 'when user does not exist' do
      it 'raise ActiveRecord::RecordNotFound' do
        expect { get_20_like_records(start0, user.id + 1) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
