import React, { useState } from 'react';
import { Formik, Field, FormikHelpers } from 'formik';
import withModal from '../../elements/Modal';

import { FILE, FOLDER } from '../../utils/constants';

import { Container, Error, Top, Toggle, Form } from './styles';

// Define the props interface for FileInfo component
interface FileInfoProps {
  addEntry: (entry: Entry) => void;
  closeFn: () => void;
}

// Define the structure of an entry
interface Entry {
  type: string;
  name: string;
  creatorName: string;
  size: number;
  date: string;
}

const TodayDate = (): string => {
  const d = new Date();
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const FileInfo: React.FC<FileInfoProps> = ({ addEntry, closeFn }) => {
  const [type, handleType] = useState<string>(FILE);

  return (
    <Container>
      <Top>
        <Toggle.Container>
          <Toggle.Option
            className={type === FILE ? 'selected' : ''}
            onClick={() => handleType(FILE)}
          >
            File
          </Toggle.Option>
          <Toggle.Option
            className={type === FOLDER ? 'selected' : ''}
            onClick={() => handleType(FOLDER)}
          >
            Folder
          </Toggle.Option>
        </Toggle.Container>
      </Top>

      <Formik
        initialValues={{
          type: 'file',
          name: '',
          creatorName: '',
          size: 0,
          date: TodayDate(),
        }}
        validate={(values) => {
          const errors: Partial<Entry> = {};
          if (!values.name) {
            errors.name = 'Name is Required';
          }
          if (!values.creatorName) {
            errors.creatorName = 'Creator Name is Required';
          }
          return errors;
        }}
        onSubmit={(values, actions: FormikHelpers<Entry>) => {
          addEntry({
            ...values,
            type,
          });
          closeFn();
        }}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <Form.Container>
            <div className="formField">
              <Field
                placeholder="Name"
                onChange={handleChange}
                name="name"
                className="field"
                value={values.name}
                autoComplete="off"
              />
              {errors.name && touched.name && <Error>{errors.name}</Error>}
            </div>

            <div className="formField">
              <Field
                placeholder="Creator"
                onChange={handleChange}
                name="creatorName"
                className="field"
                value={values.creatorName}
                autoComplete="off"
              />
              {errors.creatorName && touched.creatorName && (
                <Error>{errors.creatorName}</Error>
              )}
            </div>

            <div className="formField">
              <Field
                placeholder="Size"
                type="number"
                onChange={handleChange}
                name="size"
                className="field"
                min="0"
                value={values.size}
              />
            </div>

            <div className="formField">
              <Field
                placeholder="date"
                type="date"
                onChange={handleChange}
                name="date"
                className="field"
                value={values.date}
              />
            </div>

            <Form.Submit
              type="submit"
              disabled={!values.name || !values.creatorName || !touched.name || !touched.creatorName}
              className={
                !values.name || !values.creatorName ? 'disabled' : ''
              }
              onClick={() => handleSubmit()}
            >
              Create
            </Form.Submit>
          </Form.Container>
        )}
      </Formik>
    </Container>
  );
};

export default withModal(FileInfo);