import { isNil } from "./utils";

interface Props {
  onShareSuccess?: (nativeShare: boolean) => void;
  onShareCancel?: (nativeShare: boolean) => void;
  url?: string;
  title?: string;
  text: string;
}

export const useShare = ({
  onShareCancel = () => null,
  onShareSuccess = () => null,
  title,
  text,
  url,
}: Props) => {
  const handleShare = () => {
    const canShare =
      (!isNil(navigator.canShare) &&
        navigator.canShare({ title, text, url })) ||
      !isNil(navigator.share);

    if (canShare) {
      return navigator
        .share({ title, text, url })
        .then(() => onShareSuccess(true))
        .catch(() => onShareCancel(true));
    }
    return navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard");
        onShareSuccess(false);
      })
      .catch(() => {
        alert("Something went wrong");
      });
  };

  return handleShare;
};
