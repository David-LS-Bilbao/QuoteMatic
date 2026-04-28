export PATH=/opt/homebrew/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin

# Added by LM Studio CLI (lms)
export PATH="$PATH:/Users/david_mac/.lmstudio/bin"
# End of LM Studio CLI section

# Added by Antigravity
export PATH="/Users/david_mac/.antigravity/antigravity/bin:$PATH"

export HISTFILE="$HOME/.zsh_history"
export HISTSIZE=50000
export SAVEHIST=50000

setopt APPEND_HISTORY
setopt AUTO_CD
setopt HIST_EXPIRE_DUPS_FIRST
setopt HIST_FIND_NO_DUPS
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_SPACE
setopt HIST_REDUCE_BLANKS
setopt INC_APPEND_HISTORY
setopt INTERACTIVE_COMMENTS
setopt SHARE_HISTORY

autoload -Uz compinit
compinit -d "${XDG_CACHE_HOME:-$HOME/.cache}/zcompdump"

bindkey -e

export FZF_DEFAULT_OPTS="--height=40% --layout=reverse --border"

if command -v rg >/dev/null 2>&1; then
  export FZF_DEFAULT_COMMAND='rg --files --hidden --follow --glob "!.git"'
fi

if command -v eza >/dev/null 2>&1; then
  alias ls='eza --icons=auto'
  alias ll='eza -lah --icons=auto --group-directories-first'
  alias la='eza -la --icons=auto --group-directories-first'
  alias lt='eza --tree --level=2 --icons=auto'
fi

alias ..='cd ..'
alias ...='cd ../..'

BREW_PREFIX="$(brew --prefix 2>/dev/null)"

if command -v zoxide >/dev/null 2>&1; then
  eval "$(zoxide init zsh)"
fi

if [ -n "$BREW_PREFIX" ] && [ -f "$BREW_PREFIX/opt/fzf/shell/completion.zsh" ]; then
  source "$BREW_PREFIX/opt/fzf/shell/completion.zsh"
fi

if [ -n "$BREW_PREFIX" ] && [ -f "$BREW_PREFIX/opt/fzf/shell/key-bindings.zsh" ]; then
  source "$BREW_PREFIX/opt/fzf/shell/key-bindings.zsh"
fi

if [ -n "$BREW_PREFIX" ] && [ -f "$BREW_PREFIX/share/zsh-autosuggestions/zsh-autosuggestions.zsh" ]; then
  source "$BREW_PREFIX/share/zsh-autosuggestions/zsh-autosuggestions.zsh"
  ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=8"
fi

if command -v starship >/dev/null 2>&1; then
  eval "$(starship init zsh)"
fi

if [ -n "$BREW_PREFIX" ] && [ -f "$BREW_PREFIX/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" ]; then
  source "$BREW_PREFIX/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh"
fi
