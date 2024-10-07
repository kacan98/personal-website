import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
import { ReactNode } from "react";

export type CvLanguageSelectProps = {
  selectedLanguage: string;
  handleLanguageChange: (
    event: SelectChangeEvent<string>,
    child: ReactNode
  ) => void;
};
export function CvLanguageSelectionComponent({
  selectedLanguage,
  handleLanguageChange,
}: CvLanguageSelectProps) {
  return (
    <FormControl sx={{ mt: 2 }} fullWidth>
      <InputLabel>Language</InputLabel>
      <Select
        value={selectedLanguage}
        label="Language"
        onChange={handleLanguageChange}
      >
        {extraSupportedLanguages.map((language) => (
          <MenuItem key={language} value={language}>
            {language}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CvLanguageSelectionComponent;

const extraSupportedLanguages = ["English", "Czech", "Danish", "Swedish"];
