pylint:  ## Run pylint on all .py files
	pylint src/* --rcfile=.pylintrc

install:  ## Install req
	pip install -r requirements.txt

unittest:  ## Run unittests
	python -m pytest tests/$(test) --cov

integration_test:  ## Run integration tests
	python -m pytest integration_tests/$(test) --cov

full_test:  ## Run all tests
	python -m pytest tests integration_tests --cov

autodoc: ## Generate automatic documentation
	pydoc-markdown -p src > doc.md
	mdsplit doc.md
	rm doc.md
	cp -r doc src
	rm -r doc
	rm src/doc/doc.md
	## npx markdown-notes-tree --ignore **/LICENSE.md --ignore **/AUTHORS.md --noSubdirectoryTrees
