import { useMemo } from "react";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ShareButtonProps = {
  url: string;
  text: string;
  buttonText: string;
  platform: "facebook" | "twitter" | "linkedin";
};

export const ShareButton: React.FC<ShareButtonProps> = (props) => {
  const { url, text, buttonText, platform } = props;
  const { shareUrl, icon } = useMemo(() => {
    switch (platform) {
      case "facebook":
        return {
          shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          icon: faFacebook,
        };
      case "twitter":
        return {
          shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(text)}`,
          icon: faTwitter,
        };
      case "linkedin":
        return {
          shareUrl: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
            url
          )}&title=${encodeURIComponent(text)}`,
          icon: faLinkedin,
        };
      default:
        return { shareUrl: "", icon: null };
    }
  }, [platform, url, text]);

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-primary btn-sm mx-1"
    >
      {icon && <FontAwesomeIcon icon={icon} />} {buttonText}
    </a>
  );
};
