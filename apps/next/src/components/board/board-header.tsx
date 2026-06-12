import { GithubFilled, TwitterOutlined } from '@ant-design/icons';

const links = [
  { label: '🍺 Support', href: 'https://www.buymeacoffee.com/trungvose' },
  { label: '🎧 Spotify', href: 'https://github.com/trungk18/angular-spotify' },
  { label: '🎮 Tetris', href: 'https://tetris.trungk18.com/' },
  { label: '📕 Storybook', href: 'https://jira-storybook.trungk18.com/' },
  {
    label: 'Tweet',
    href: 'https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Ftrungk18%2Fjira-clone-angular&text=Awesome%20Jira%20clone%20app%20built%20with%20Angular%209%20and%20Akita&hashtags=angular,akita,typescript',
  },
  { label: 'Source Code', href: 'https://github.com/trungk18/jira-clone-angular' },
];

export function BoardHeader() {
  return (
    <header className="flex items-center justify-between mt-3 text-[#172B4D] gap-4">
      <div className="text-2xl font-medium">Kanban board</div>
      <div className="flex flex-wrap justify-end gap-2">
        {links.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-[3px] border border-[#DFE1E6] bg-white px-3 py-[6px] text-[14px] text-[#42526E] hover:bg-[#F4F5F7]"
          >
            {item.label === 'Tweet' ? (
              <span className="flex items-center">
                <TwitterOutlined className="mr-2 text-[#1d9bf0]" />
                Tweet
              </span>
            ) : null}
            {item.label === 'Source Code' ? (
              <span className="flex items-center">
                <GithubFilled className="mr-2 text-[#172b4d]" />
                Source Code
              </span>
            ) : null}
            {item.label !== 'Tweet' && item.label !== 'Source Code' ? item.label : null}
          </a>
        ))}
      </div>
    </header>
  );
}
