help: ## Shows an help screen
	@echo "@srob/files"
	@echo "Defined make targets :"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install dependancies
	npm i

build:
	npm run build

publish-patch: test ## Publish a new version on NPM, with PATCH semver level
	npm version patch
	npm publish --access public
	git push origin "$$(git rev-parse --abbrev-ref HEAD)"
	git push origin --tags

test: ## Runs tests
	DIFF="diff -u" npm test
