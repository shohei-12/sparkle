require 'rails_helper'

RSpec.describe 'Api::V1::Comments', type: :request do
  let(:user) { create(:user) }
  let(:token) { sign_in({ email: user.email, password: 'password' }) }
  let(:record) { create(:record) }
  let(:comment) { create(:comment) }
  let(:valid_data) do
    {
      comment: {
        record_id: record.id,
        target: 'appearance',
        content: 'comment',
        reply_comment_id: nil,
        reply_user_id: nil
      }
    }
  end
  let(:invalid_data) do
    {
      comment: {
        record_id: nil,
        target: 'appearance',
        content: 'comment',
        reply_comment_id: nil,
        reply_user_id: nil
      }
    }
  end
  let(:start0) do
    { start: 0 }
  end
  let(:start20) do
    { start: 20 }
  end

  describe 'POST /api/v1/comments' do
    context 'when current user exists' do
      context 'when data is valid' do
        it 'make comment' do
          expect { make_comment(valid_data, token) }.to change(Comment, :count).by(1)
          expect(response.status).to eq 200
        end
      end

      context 'when data is invalid' do
        it 'raise NoMethodError' do
          expect { make_comment(invalid_data, token) }.to raise_error(NoMethodError)
        end
      end
    end

    context 'when current user does not exist' do
      it 'raise NoMethodError' do
        expect { make_comment(valid_data, nil) }.to raise_error(NoMethodError)
      end
    end
  end

  describe 'GET /api/v1/comments/:record_id/:target' do
    context 'when there are more than 20 comments' do
      before do
        21.times do
          make_comment(valid_data, token)
        end
      end

      it 'get 20 comments' do
        get_20_comments(record.id, 'appearance', start0)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body).length).to eq 20
      end

      it 'get 1 comment' do
        get_20_comments(record.id, 'appearance', start20)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body).length).to eq 1
      end
    end

    context 'when there are less than 20 comments' do
      context 'when there are more than 1 comment' do
        before do
          2.times do
            make_comment(valid_data, token)
          end
        end

        it 'get 2 comments' do
          get_20_comments(record.id, 'appearance', start0)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body).length).to eq 2
        end

        it 'not get comments' do
          get_20_comments(record.id, 'appearance', start20)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body).length).to eq 0
        end
      end

      context 'when comments does not exist' do
        it 'not get comments' do
          get_20_comments(record.id, 'appearance', start0)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body).length).to eq 0
        end
      end
    end
  end

  describe 'DELETE /api/v1/comments/:id' do
    context 'when comment exists' do
      context 'when commenter matches current user' do
        before { make_comment(valid_data, token) }

        it 'delete comment' do
          expect { delete_comment(Comment.first.id, token) }.to change(Comment, :count).by(-1)
          expect(response.status).to eq 204
        end
      end

      context 'when commenter does not match current user' do
        before { @comment = create(:comment) }

        it 'not delete comment' do
          expect { delete_comment(@comment.id, token) }.to change(Comment, :count).by(0)
          expect(response.status).to eq 204
        end
      end
    end

    context 'when comment does not exist' do
      it 'raise ActiveRecord::RecordNotFound' do
        expect { delete_comment(comment.id + 1, token) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
