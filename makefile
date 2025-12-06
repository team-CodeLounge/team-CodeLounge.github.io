# make
# make MSG="fix: mapView crash"
# make deploy

.PHONY: all deploy

# 기본 메시지 설정
MSG ?= update

# make → deploy 실행
all: deploy

# git add → commit → push
deploy:
	@git add .
	@git commit -m "$(MSG)" || echo "⚠️ No changes to commit"
	@git push origin main
	@echo "🚀 Git push 완료! (message: $(MSG))"