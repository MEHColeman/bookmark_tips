# bookmark_tips — task runner (just)

# List available recipes
default:
    @just --list

# Run the test suite (vitest)
test *args:
    npx vitest run {{args}}
